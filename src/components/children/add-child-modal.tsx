import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/button';
import Input from '../ui/input';
import { createChild } from '../../lib/supabase';
import toast from 'react-hot-toast';

const childSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  birthdate: z.string().min(1, 'Birthdate is required'),
  parent_name: z.string().min(1, 'Parent name is required'),
  parent_email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  allergies: z.string().optional(),
  special_needs: z.string().optional(),
});

type ChildFormData = z.infer<typeof childSchema>;

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddChildModal: React.FC<AddChildModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ChildFormData>({
    resolver: zodResolver(childSchema),
  });

  const onSubmit = async (data: ChildFormData) => {
    try {
      await createChild({
        ...data,
        tags: [],
      });
      
      toast.success('Child added successfully');
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to add child');
      console.error('Error adding child:', error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            Add New Child
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Child's Full Name"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              type="date"
              label="Date of Birth"
              error={errors.birthdate?.message}
              {...register('birthdate')}
            />

            <Input
              label="Parent's Name"
              error={errors.parent_name?.message}
              {...register('parent_name')}
            />

            <Input
              label="Parent's Email"
              type="email"
              error={errors.parent_email?.message}
              {...register('parent_email')}
            />

            <Input
              label="Phone Number (optional)"
              type="tel"
              {...register('phone')}
            />

            <Input
              label="Allergies (optional)"
              helper="List any allergies or food restrictions"
              {...register('allergies')}
            />

            <Input
              label="Special Needs (optional)"
              helper="Any special requirements or notes"
              {...register('special_needs')}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
              >
                Add Child
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddChildModal;