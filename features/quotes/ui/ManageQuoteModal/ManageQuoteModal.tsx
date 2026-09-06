"use client";

import { Input } from "@/shared/ui/Input";
import { Modal } from "@/shared/ui/Modal";
import { Select } from "@/shared/ui/Select";
import { FC } from "react";
import { useQuoteModal } from "../../lib/providers/QuoteModalProvider";
import { User } from "@/features/users/models";
import { Avatar } from "@/shared/ui/Avatar";
import { Controller, useFormState } from "react-hook-form";
import { addQuote } from "../../actions/addQuote";
import { editQuote } from "../../actions/editQuote";

export const ManageQuoteModal: FC<{ users: User[] }> = ({ users }) => {
  const { state, close, form } = useQuoteModal();
  const { register, control } = form;
  const { errors } = useFormState({ control });

  const isCreateMode = state.mode === "add";

  const handleOk = async () => {
    const valid = await form.trigger();
    if (!valid) return false;

    const values = form.getValues();

    const result = isCreateMode
      ? await addQuote(values)
      : await editQuote(values, state.mode === "edit" ? state.quote.id : 0);

    if (!result.ok) {
      form.setError("root", {
        message:
          result.error === "unauthorized"
            ? "Сессия истекла"
            : "Не удалось сохранить цитату",
      });

      return false;
    }

    return true;
  };

  return (
    <Modal
      onClose={close}
      title={isCreateMode ? "Новая цитата" : "Редактирование цитаты"}
      subtitle={
        isCreateMode
          ? "Добавь цитату, укажи автора и дату, когда она была сказана."
          : "Редактируй цитату, укажи автора и дату, когда она была сказана."
      }
      open={state.mode !== "closed"}
      cancelText="Отмена"
      okText="Сохранить"
      onOk={handleOk}
      size="lg"
    >
      <div className="flex flex-col gap-space-md">
        <div className="flex gap-space-md">
          <Controller
            name="authorId"
            control={control}
            render={({ field, fieldState }) => (
              <Select
                label="Автор"
                options={users.map((user) => ({
                  label: user.name,
                  value: String(user.id),
                  icon: (
                    <Avatar src={user.avatarUrl} size={20} shape="square" />
                  ),
                }))}
                searchable
                placeholder="Выберите пользователя"
                value={field.value}
                onChange={(value) => field.onChange(value)}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Input.Date
            label="Дата"
            error={!!errors.date}
            helperText={errors.date?.message}
            {...register("date")}
          />
        </div>
        <Input.TextArea
          label="Цитата"
          placeholder="Текст цитаты..."
          showCount
          maxLength={500}
          error={!!errors.quote}
          helperText={errors.quote?.message}
          {...register("quote")}
        />
      </div>
    </Modal>
  );
};
