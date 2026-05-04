import { getTaxonomyTags } from "@/app/actions/taxonomy";
import TaxonomyManager from "@/components/settings/TaxonomyManager";

export const dynamic = "force-dynamic";

export default async function TaxonomySettingsPage() {
  // Fetch all categories
  const categories = [
    { id: "dietary_tag", label: "Dietary Tags" },
    { id: "disease_tag", label: "Disease Tags" },
    { id: "region_tag", label: "Region Tags" },
    { id: "disease", label: "Diseases" },
    { id: "allergy", label: "Allergies" },
  ];

  const allTags = await Promise.all(
    categories.map(async (cat) => ({
      category: cat.id,
      label: cat.label,
      tags: await getTaxonomyTags(cat.id, true), // includeInactive = true
    }))
  );

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant bg-surface-container/30">
          <h2 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">database</span>
            Taxonomy Management
          </h2>
        </div>
        <div className="p-6">
          <TaxonomyManager initialData={allTags} />
        </div>
      </div>
    </div>
  );
}
