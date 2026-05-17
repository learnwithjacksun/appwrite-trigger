import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUiStore } from "@/store/useUiStore";
import {
  createProjectSchema,
  projectFormSchema,
  type ProjectFormValues,
} from "@/validators/project";
import { useProjectMutations } from "@/hooks/useProjects";
import type { CreateProjectInput, Project, UpdateProjectInput } from "@/types/api";

interface ProjectModalFormProps {
  editingProject: Project | null;
  onClose: () => void;
}

function ProjectModalForm({ editingProject, onClose }: ProjectModalFormProps) {
  const { createProject, updateProject } = useProjectMutations();
  const isEdit = Boolean(editingProject);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(isEdit ? projectFormSchema : createProjectSchema),
    defaultValues: {
      projectName: "",
      appwriteEndpoint: "",
      projectId: "",
      apiKey: "",
      autoPingEnabled: true,
    },
  });

  useEffect(() => {
    if (editingProject) {
      form.reset({
        projectName: editingProject.projectName,
        appwriteEndpoint: editingProject.appwriteEndpoint,
        projectId: editingProject.projectId,
        apiKey: "",
        autoPingEnabled: editingProject.autoPingEnabled,
      });
    } else {
      form.reset({
        projectName: "",
        appwriteEndpoint: "",
        projectId: "",
        apiKey: "",
        autoPingEnabled: true,
      });
    }
  }, [editingProject, form]);

  const onSubmit: SubmitHandler<ProjectFormValues> = async (values) => {
    try {
      if (isEdit && editingProject) {
        const body: UpdateProjectInput = {
          projectName: values.projectName,
          appwriteEndpoint: values.appwriteEndpoint,
          projectId: values.projectId,
          autoPingEnabled: values.autoPingEnabled,
        };
        const nextKey = values.apiKey?.trim();
        if (nextKey && nextKey.length > 0) {
          body.apiKey = nextKey;
        }
        await updateProject.mutateAsync({
          id: editingProject._id,
          body,
        });
      } else {
        const body: CreateProjectInput = {
          projectName: values.projectName,
          appwriteEndpoint: values.appwriteEndpoint,
          projectId: values.projectId,
          apiKey: (values.apiKey ?? "").trim(),
          autoPingEnabled: values.autoPingEnabled,
        };
        await createProject.mutateAsync(body);
      }
      onClose();
    } catch {
      /* mutation surfaces toast */
    }
  };

  const busy = createProject.isPending || updateProject.isPending;

  return (
    <>
      <form
        id="project-modal-form"
        className="space-y-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Input
          label="Project name"
          {...form.register("projectName")}
          error={form.formState.errors.projectName?.message}
        />
        <Input
          label="Appwrite endpoint"
          placeholder="https://cloud.appwrite.io"
          hint="Host only — no /v1. Use your region (e.g. fra.cloud.appwrite.io) if not on global cloud."
          {...form.register("appwriteEndpoint")}
          error={form.formState.errors.appwriteEndpoint?.message}
        />
        <Input
          label="Project ID"
          {...form.register("projectId")}
          error={form.formState.errors.projectId?.message}
        />
        <Input
          label={isEdit ? "API key (optional)" : "API key"}
          type="password"
          autoComplete="off"
          {...form.register("apiKey")}
          error={form.formState.errors.apiKey?.message}
        />
        <label className="flex items-center gap-2 text-xs text-main">
          <input
            type="checkbox"
            className="size-3.5 rounded-sm border border-line bg-background accent-primary"
            {...form.register("autoPingEnabled")}
          />
          Enable scheduled pings
        </label>
      </form>
      <div className="flex w-full items-center justify-end gap-2 border-t border-line px-4 py-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onClose()}
          disabled={busy}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="project-modal-form"
          variant="primary"
          loading={busy}
        >
          {isEdit ? "Save changes" : "Create project"}
        </Button>
      </div>
    </>
  );
}

export function ProjectModal() {
  const { projectModalOpen, editingProject, closeProjectModal } = useUiStore();

  return (
    <Modal
      open={projectModalOpen}
      onClose={closeProjectModal}
      title={editingProject ? "Edit project" : "New project"}
      description="Wire an Appwrite endpoint for reachability checks."
    >
      {projectModalOpen ? (
        <ProjectModalForm
          key={editingProject?._id ?? "create"}
          editingProject={editingProject}
          onClose={closeProjectModal}
        />
      ) : null}
    </Modal>
  );
}
