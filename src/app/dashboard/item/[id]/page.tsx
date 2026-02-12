import ItemDetail from "./item-detail";

export function generateStaticParams() {
  return [
    { id: "item-1" },
    { id: "item-2" },
    { id: "item-3" },
    { id: "item-4" },
    { id: "item-5" },
    { id: "item-6" },
    { id: "item-7" },
    { id: "item-8" },
    { id: "item-9" },
    { id: "item-10" },
  ];
}

export default function ItemDetailPage() {
  return <ItemDetail />;
}
