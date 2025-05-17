import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/button';
import Input from '../ui/input';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  datetime: z.string().min(1, 'Date and time is required'),
  targetGroup: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface ScheduleEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ScheduleEventModal: React.FC<ScheduleEventModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const onSubmit = async (data: EventFormData) => {
    try {
      const { error } = await supabase
        .from('events')
        .insert({
          title: data.title,
          description: data.description,
          datetime: new Date(data.datetime).toISOString(),
          target_group: data.targetGroup ? data.targetGroup.split(',').map(t => t.trim()) : null,
        });

      if (error) throw error;
      
      toast.success('Event scheduled successfully');
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to schedule event');
      console.error('Error scheduling event:', error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            Schedule New Event
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Event Title"
              error={errors.title?.message}
              {...register('title')}
            />

            <Input
              label="Description"
              helper="Brief description of the event"
              {...register('description')}
            />

            <Input
              type="datetime-local"
              label="Date and Time"
              error={errors.datetime?.message}
              {...register('datetime')}
            />

            <Input
              label="Target Group (optional)"
              helper="Comma-separated list of tags to filter children"
              {...register('targetGroup')}
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
                Schedule Event
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ScheduleEventModal;