import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/button';
import Input from '../ui/input';
import TemplateEditor from '../email/template-editor';
import { createEmailTemplate } from '../../lib/supabase';
import toast from 'react-hot-toast';

const campaignSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  sendDate: z.string().min(1, 'Send date is required'),
  tags: z.string().optional(),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [content, setContent] = React.useState('');
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
  });

  const onSubmit = async (data: CampaignFormData) => {
    try {
      await createEmailTemplate({
        title: data.title,
        subject: data.subject,
        html_content: content,
        event_type: 'promotion',
        scheduled_for: new Date(data.sendDate).toISOString(),
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
      });
      
      toast.success('Campaign created successfully');
      reset();
      setContent('');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to create campaign');
      console.error('Error creating campaign:', error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl w-full rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            Create New Campaign
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Campaign Title"
                error={errors.title?.message}
                {...register('title')}
              />

              <Input
                label="Email Subject"
                error={errors.subject?.message}
                {...register('subject')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="datetime-local"
                label="Send Date"
                error={errors.sendDate?.message}
                {...register('sendDate')}
              />

              <Input
                label="Tags (comma-separated)"
                helper="Filter recipients by tags"
                {...register('tags')}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Message Content
              </label>
              <TemplateEditor
                initialContent={content}
                onChange={setContent}
              />
            </div>

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
                Create Campaign
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateCampaignModal;