import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormValues } from "@/validators/auth";

export default function Login() {
  const { login } = useAuth();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      await login.mutateAsync(values);
    } catch {
      /* surfaced by mutation */
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1 text-center">
        <h2 className="text-base font-semibold text-main">Sign in</h2>
        <p className="text-xs text-muted">Use the account you registered.</p>
      </div>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
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
          autoComplete="current-password"
          {...form.register("password")}
          error={form.formState.errors.password?.message}
        />
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={login.isPending}
        >
          Continue
        </Button>
      </form>
      <p className="text-center text-xs text-muted">
        No account?{" "}
        <Link className="font-medium text-main underline-offset-4 hover:underline" to="/register">
          Create one
        </Link>
      </p>
    </div>
  );
}
