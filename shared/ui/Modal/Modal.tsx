"use client";

import * as Ariakit from "@ariakit/react";
import type { ReactNode } from "react";
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
  onOk?: () => void;
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
      hideOnEscape={dismissible}
      hideOnInteractOutside={dismissible}
      backdrop={<div className="modal-backdrop" />}
      data-size={size}
      className={["modal", "modal-dialog", className].filter(Boolean).join(" ")}
    >
      <ModalHeader
        size={size}
        title={title}
        subtitle={subtitle}
        onClose={onClose}
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
        onOk={
          onOk &&
          (() => {
            onOk();
            onClose();
          })
        }
        onCancel={() => {
          onCancel?.();
          onClose();
        }}
      />
    </Ariakit.Dialog>
  );
};

interface ModalHeaderProps {
  size: ModalSize;
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
}

export const ModalHeader = ({
  size,
  title,
  subtitle,
  onClose,
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
      />
    </div>
  );
};

interface ModalFooterProps {
  size: ModalSize;
  okText: ReactNode;
  cancelText: ReactNode;
  onOk?: () => void;
  onCancel: () => void;
}

export const ModalFooter = ({
  size,
  okText,
  cancelText,
  onOk,
  onCancel,
}: ModalFooterProps) => {
  return (
    <div className="modal__footer" data-size={size}>
      <Button variant="outlined" tone="tertiary" onClick={onCancel}>
        {cancelText}
      </Button>
      {onOk && (
        <Button variant="filled" tone="secondary" onClick={onOk}>
          {okText}
        </Button>
      )}
    </div>
  );
};

Modal.displayName = "Modal";
