import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, type RegisterFormValues } from "@/validators/auth";

export default function Register() {
  const { register: registerUser } = useAuth();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (values) => {
    try {
      await registerUser.mutateAsync(values);
    } catch {
      /* surfaced by mutation */
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1 text-center">
        <h2 className="text-base font-semibold text-main">Create account</h2>
        <p className="text-xs text-muted">Start monitoring Appwrite projects.</p>
      </div>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <Input
          label="Name"
          autoComplete="name"
          {...form.register("name")}
          error={form.formState.errors.name?.message}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          {...form.register("email")}
          error={form.formState.errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          {...form.register("password")}
          error={form.formState.errors.password?.message}
        />
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={registerUser.isPending}
        >
          Register
        </Button>
      </form>
      <p className="text-center text-xs text-muted">
        Already have an account?{" "}
        <Link className="font-medium text-main underline-offset-4 hover:underline" to="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
