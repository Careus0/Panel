
import { LoginForm } from '@/components/auth/login-form';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 
                   bg-gradient-to-r from-background via-secondary to-background 
                   bg-[length:200%_200%] animate-background-pan">
      <div className="mb-8 flex justify-center">
        <Logo />
      </div>
      <LoginForm />
    </div>
  );
}
