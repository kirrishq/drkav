import {
  CmsOperationPage,
  getCmsOperationMetadata,
} from "@/components/content-page/cms-operation-page";

const path = "/operaczii/diastaz-myshc-zhivota";

export function generateMetadata() {
  return getCmsOperationMetadata(path);
}

export default function DiastasisOperationPage() {
  return <CmsOperationPage path={path} />;
}
