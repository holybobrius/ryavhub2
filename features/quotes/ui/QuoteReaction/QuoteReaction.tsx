import "./quote-reaction.css";
import { Button } from "@/shared/ui/Button";
import { IconThumbUp } from "@/shared/ui/icons";

interface QuoteReactionProps {
  kind: "like" | "dislike";
  count: number;
  isActive: boolean;
}

export const QuoteReaction = ({
  kind,
  count,
  isActive,
}: QuoteReactionProps) => {
  const isLike = kind === "like";

  return (
    <Button
      variant="soft"
      tone="tertiary"
      size="md"
      className="reaction"
      data-kind={kind}
      data-active={isActive}
      aria-label={isLike ? "Нравится" : "Не нравится"}
      rightIcon={<IconThumbUp className={isLike ? undefined : "rotate-180"} />}
    >
      {count}
    </Button>
  );
};
