import { CmsEntryTemplate } from "@/components/content-page/cms-entry-template";

type BeforeAfterEntryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BeforeAfterEntryPage({ params }: BeforeAfterEntryPageProps) {
  const { slug } = await params;
  return <CmsEntryTemplate slug={slug} />;
}
