import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/button';
import Input from '../ui/input';
import TemplateEditor from '../email/template-editor';
import { createEmailTemplate, supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const campaignSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  sendDate: z.string().min(1, 'Send date is required'),
  tags: z.string().optional(),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface Child {
  id: string;
  name: string;
  parent_name: string;
  parent_email: string;
  tags: string[];
}

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [content, setContent] = React.useState('');
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [isChildrenOpen, setIsChildrenOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
  });

  useEffect(() => {
    if (isOpen) {
      fetchChildren();
    }
  }, [isOpen]);

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('id, name, parent_name, parent_email, tags')
        .order('name');
      
      if (error) throw error;
      setChildren(data || []);
    } catch (error) {
      console.error('Error fetching children:', error);
      toast.error('Failed to load children');
    }
  };

  const tags = watch('tags');
  const filteredChildren = React.useMemo(() => {
    if (!tags) return children;
    const tagArray = tags.split(',').map(t => t.trim().toLowerCase());
    return children.filter(child => 
      child.tags.some(tag => tagArray.includes(tag.toLowerCase()))
    );
  }, [children, tags]);

  const onSubmit = async (data: CampaignFormData) => {
    try {
      setIsLoading(true);
      if (selectedChildren.length === 0) {
        toast.error('Please select at least one recipient');
        return;
      }

      await createEmailTemplate({
        title: data.title,
        subject: data.subject,
        html_content: content,
        event_type: 'promotion',
        scheduled_for: new Date(data.sendDate).toISOString(),
        recipients: selectedChildren,
      });
      
      toast.success('Campaign created successfully');
      reset();
      setContent('');
      setSelectedChildren([]);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to create campaign');
      console.error('Error creating campaign:', error);
    } finally {
      setIsLoading(false);
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
                label="Filter by Tags (comma-separated)"
                helper="Filter recipients by tags"
                {...register('tags')}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Recipients
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsChildrenOpen(!isChildrenOpen)}
                  className={cn(
                    "relative w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm",
                    isChildrenOpen && "ring-1 ring-indigo-500 border-indigo-500"
                  )}
                >
                  <span className="block truncate">
                    {selectedChildren.length === 0
                      ? "Select recipients..."
                      : `${selectedChildren.length} recipient(s) selected`}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                  </span>
                </button>

                {isChildrenOpen && (
                  <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <div className="px-3 py-2 border-b">
                      <button
                        type="button"
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                        onClick={() => {
                          setSelectedChildren(
                            selectedChildren.length === filteredChildren.length
                              ? []
                              : filteredChildren.map(c => c.id)
                          );
                        }}
                      >
                        {selectedChildren.length === filteredChildren.length
                          ? "Deselect all"
                          : "Select all"}
                      </button>
                    </div>
                    {filteredChildren.map((child) => (
                      <div
                        key={child.id}
                        className={cn(
                          "relative cursor-pointer select-none py-2 pl-8 pr-4 hover:bg-indigo-50",
                          selectedChildren.includes(child.id) && "bg-indigo-50"
                        )}
                        onClick={() => {
                          setSelectedChildren(prev =>
                            prev.includes(child.id)
                              ? prev.filter(id => id !== child.id)
                              : [...prev, child.id]
                          );
                        }}
                      >
                        <span className="block truncate">
                          {child.name} ({child.parent_name})
                        </span>
                        {selectedChildren.includes(child.id) && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                            <Check className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {filteredChildren.length} recipient(s) available
              </p>
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
                isLoading={isSubmitting || isLoading}
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