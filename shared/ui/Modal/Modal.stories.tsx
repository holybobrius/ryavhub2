import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Modal, ModalHeader, ModalFooter } from "./Modal";
import type { ModalProps, ModalSize } from "./Modal";
import { Button } from "../Button";
import { Input } from "../Input";
import { Typography } from "../Typography";

const meta: Meta<typeof Modal> = {
  title: "UI/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    title: { control: "text" },
    subtitle: { control: "text" },
    okText: { control: "text" },
    cancelText: { control: "text" },
    dismissible: { control: "boolean" },
    open: { control: false },
    onClose: { control: false },
    onOk: { control: false },
    onCancel: { control: false },
    children: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Modal>;

const SIZES: ModalSize[] = ["sm", "md", "lg"];

const PlaygroundDemo = (args: Partial<ModalProps>) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Открыть модалку</Button>
      <Modal
        title="Heading"
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        onOk={() => {}}
      >
        <Input label="Название" placeholder="Введите название" />
        <Input.TextArea
          label="Описание"
          placeholder="Пара слов о том, что происходит"
          rows={4}
        />
      </Modal>
    </>
  );
};

export const Playground: Story = {
  args: {
    title: "Heading",
    subtitle: "Description",
    size: "md",
    okText: "Сохранить",
    cancelText: "Отмена",
    dismissible: true,
  },
  render: (args) => <PlaygroundDemo {...args} />,
};

const SizesDemo = () => {
  const [openSize, setOpenSize] = useState<ModalSize | null>(null);

  return (
    <div className="flex flex-wrap gap-12">
      {SIZES.map((size) => (
        <Button key={size} onClick={() => setOpenSize(size)}>
          {size}
        </Button>
      ))}

      {openSize && (
        <Modal
          open
          size={openSize}
          title="Heading"
          subtitle="Description"
          okText="Сохранить"
          onOk={() => {}}
          onClose={() => setOpenSize(null)}
        >
          <Typography.Body size="sm" color="secondary">
            Средняя часть намеренно свободная: сюда кладётся любой контент.
          </Typography.Body>
        </Modal>
      )}
    </div>
  );
};

export const Sizes: Story = {
  name: "Размеры (живые)",
  render: () => <SizesDemo />,
};

export const Composition: Story = {
  name: "Композиция (витрина)",
  render: () => (
    <div className="flex flex-col gap-24">
      {SIZES.map((size) => (
        <div key={size} className="modal" data-size={size}>
          <ModalHeader
            size={size}
            title="Heading"
            subtitle="Description"
            onClose={() => {}}
            closeDisabled={false}
          />
          <div className="modal__content" data-size={size}>
            <Typography.Body size="sm" color="tertiary">
              Контент
            </Typography.Body>
          </div>
          <ModalFooter
            size={size}
            okText="Сохранить"
            cancelText="Отмена"
            onOk={() => {}}
            onCancel={() => {}}
            pending={false}
          />
        </div>
      ))}
    </div>
  ),
};

export const Header: Story = {
  name: "Шапка",
  render: () => (
    <div className="flex flex-col gap-24">
      {SIZES.map((size) => (
        <div key={size} className="modal" data-size={size}>
          <ModalHeader
            size={size}
            title="Heading"
            subtitle="Description"
            onClose={() => {}}
            closeDisabled={false}
          />
        </div>
      ))}
    </div>
  ),
};

export const Footer: Story = {
  name: "Футер",
  render: () => (
    <div className="flex flex-col gap-24">
      {SIZES.map((size) => (
        <div key={size} className="modal" data-size={size}>
          <ModalFooter
            size={size}
            okText="Сохранить"
            cancelText="Отмена"
            onOk={() => {}}
            onCancel={() => {}}
            pending={false}
          />
        </div>
      ))}
      <div className="modal" data-size="md">
        <ModalFooter
          size="md"
          okText="Сохранить"
          cancelText="Отмена"
          onCancel={() => {}}
          pending={false}
        />
      </div>
    </div>
  ),
};

const ConfirmDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button tone="error" onClick={() => setOpen(true)}>
        Удалить цитату
      </Button>
      <Modal
        open={open}
        size="sm"
        title="Удалить цитату?"
        subtitle="Отменить не получится"
        okText="Удалить"
        onOk={() => {}}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export const Confirm: Story = {
  name: "Подтверждение (без контента)",
  render: () => <ConfirmDemo />,
};

const ReadOnlyDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Открыть правила</Button>
      <Modal
        open={open}
        title="Правила гонтлета"
        subtitle="Скроллится только средняя часть — шапка и футер закреплены"
        cancelText="Понятно"
        onClose={() => setOpen(false)}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <Typography.Body key={i} size="sm" color="secondary">
            {i + 1}. Пункт правил, который занимает место и заставляет контент
            скроллиться.
          </Typography.Body>
        ))}
      </Modal>
    </>
  );
};

export const ReadOnly: Story = {
  name: "Только чтение (длинный контент)",
  render: () => <ReadOnlyDemo />,
};
