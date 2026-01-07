import React, { useState } from 'react';
import { Modal } from './Modal';
import { Text } from './Text';
import { Button } from './Button';
import { Stack } from './Stack';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  variant?: 'default' | 'danger';
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  variant = 'default',
  isLoading,
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = isLoading ?? internalLoading;

  const handleClose = () => {
    if (loading) return;
    onCancel();
  };

  const handleConfirm = async () => {
    if (loading) return;
    const result = onConfirm();
    if (result && typeof (result as Promise<unknown>).then === 'function') {
      try {
        setInternalLoading(true);
        await result;
        onCancel();
      } finally {
        setInternalLoading(false);
      }
    } else {
      onCancel();
    }
  };

  const confirmVariant = variant === 'danger' ? 'danger' : 'primary';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <Stack gap={16}>
        <Text>{description}</Text>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
          <Button
            variant="outline"
            label={cancelText}
            onClick={handleClose}
            disabled={loading}
          />
          <Button
            variant={confirmVariant}
            label={confirmText}
            isLoading={loading}
            onClick={handleConfirm}
          />
        </div>
      </Stack>
    </Modal>
  );
};

