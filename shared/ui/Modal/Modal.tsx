"use client";

import * as Ariakit from "@ariakit/react";
import { useState, type ReactNode } from "react";
import { Button } from "../Button";
import type { ButtonSize } from "../Button";
import { Typography } from "../Typography";
import type { HeadingSize } from "../Typography";
import { IconClose } from "../icons";
import "./modal.css";

export type ModalSize = "sm" | "md" | "lg";

const CLOSE_BUTTON_SIZE: Record<ModalSize, ButtonSize> = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

const TITLE_SIZE: Record<ModalSize, HeadingSize> = {
  sm: "sm",
  md: "md",
  lg: "md",
};

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  size?: ModalSize;
  onOk?: () => void | boolean | Promise<boolean | void>;
  okText?: ReactNode;
  onCancel?: () => void;
  cancelText?: ReactNode;
  dismissible?: boolean;
  children?: ReactNode;
  className?: string;
}

export const Modal = ({
  open,
  onClose,
  title,
  subtitle,
  size = "md",
  onOk,
  okText = "ОК",
  onCancel,
  cancelText = "Отмена",
  dismissible = true,
  children,
  className,
}: ModalProps) => {
  const [pending, setPending] = useState(false);

  const handleOk = async () => {
    if (pending) return;
    setPending(true);

    try {
      const result = await onOk?.();
      if (result !== false) {
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPending(false);
    }
  };

  const store = Ariakit.useDialogStore({
    open,
    setOpen: (next) => {
      if (!next) onClose();
    },
  });

  return (
    <Ariakit.Dialog
      store={store}
      unmountOnHide
      hideOnEscape={dismissible && !pending}
      hideOnInteractOutside={dismissible && !pending}
      backdrop={<div className="modal-backdrop" />}
      data-size={size}
      className={["modal", "modal-dialog", className].filter(Boolean).join(" ")}
    >
      <ModalHeader
        size={size}
        title={title}
        subtitle={subtitle}
        onClose={onClose}
        closeDisabled={pending}
      />

      {children != null && (
        <div className="modal__content" data-size={size}>
          {children}
        </div>
      )}

      <ModalFooter
        size={size}
        okText={okText}
        cancelText={cancelText}
        onOk={onOk && handleOk}
        onCancel={() => {
          onCancel?.();
          onClose();
        }}
        pending={pending}
      />
    </Ariakit.Dialog>
  );
};

interface ModalHeaderProps {
  size: ModalSize;
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  closeDisabled: boolean;
}

export const ModalHeader = ({
  size,
  title,
  subtitle,
  onClose,
  closeDisabled,
}: ModalHeaderProps) => {
  return (
    <div className="modal__header" data-size={size}>
      <div className="modal__titles">
        <Ariakit.DialogHeading
          render={
            <Typography.Heading
              as="h2"
              size={TITLE_SIZE[size]}
              className="modal__title"
            />
          }
        >
          {title}
        </Ariakit.DialogHeading>
        {subtitle && (
          <Ariakit.DialogDescription className="modal__description">
            {subtitle}
          </Ariakit.DialogDescription>
        )}
      </div>

      <Button
        className="modal__close"
        variant="ghost"
        tone="secondary"
        size={CLOSE_BUTTON_SIZE[size]}
        leftIcon={<IconClose />}
        aria-label="Закрыть"
        onClick={onClose}
        disabled={closeDisabled}
      />
    </div>
  );
};

interface ModalFooterProps {
  size: ModalSize;
  okText: ReactNode;
  cancelText: ReactNode;
  onOk?: () => void | Promise<boolean | void>;
  onCancel: () => void;
  pending: boolean;
}

export const ModalFooter = ({
  size,
  okText,
  cancelText,
  onOk,
  onCancel,
  pending,
}: ModalFooterProps) => {
  return (
    <div className="modal__footer" data-size={size}>
      <Button
        variant="outlined"
        tone="tertiary"
        onClick={onCancel}
        disabled={pending}
      >
        {cancelText}
      </Button>
      {onOk && (
        <Button
          variant="filled"
          tone="secondary"
          onClick={onOk}
          disabled={pending}
        >
          {okText}
        </Button>
      )}
    </div>
  );
};

Modal.displayName = "Modal";
