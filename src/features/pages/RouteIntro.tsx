import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";

type RouteIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function RouteIntro({
  eyebrow,
  title,
  description,
  actionHref = "/contact",
  actionLabel = "Start a conversation",
}: RouteIntroProps): React.ReactNode {
  return (
    <section className="border-b border-mist-300/10">
      <div className="site-container py-24 sm:py-32">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <ButtonLink className="mt-8" href={actionHref}>
          {actionLabel}
        </ButtonLink>
      </div>
    </section>
  );
}
