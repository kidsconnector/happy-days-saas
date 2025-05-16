import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn } from 'lucide-react';
import Button from '../ui/button';
import Input from '../ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../lib/store';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Mock login - In a real app, this would be an API call
      // The real implementation would verify credentials with a backend
      setTimeout(() => {
        // Demo user - in real app this would come from API
        const mockUser = {
          id: '1',
          email: data.email,
          name: 'Demo User',
          role: 'owner' as const,
          tenantId: '1',
          createdAt: new Date().toISOString(),
        };
        
        const mockTenant = {
          id: '1',
          businessName: 'Kids Fun Zone',
          slug: 'kids-fun-zone',
          contactEmail: data.email,
          plan: 'basic' as const,
          logo: null,
          createdAt: new Date().toISOString(),
        };
        
        login(mockUser, mockTenant);
        navigate('/dashboard');
        setIsSubmitting(false);
      }, 1000);
    } catch (err) {
      setError('Invalid email or password');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <Input
        label="Email Address"
        type="email"
        fullWidth
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      
      <Input
        label="Password"
        type="password"
        fullWidth
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />
      
      <div className="pt-2">
        <Button 
          type="submit" 
          fullWidth 
          isLoading={isSubmitting}
          leftIcon={<LogIn className="h-4 w-4" />}
        >
          Sign In
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;