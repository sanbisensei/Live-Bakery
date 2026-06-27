import CakeCard from "@/components/ui/CakeCard";

export default function CakesPage() {
  return (
    <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
      <CakeCard
        slug="chocolate-fudge"
        name="Chocolate Fudge"
        price={960}
        originalPrice={1200}
      />
      <CakeCard slug="red-velvet" name="Red Velvet" price={1100} />
      <CakeCard slug="brownie-box" name="Brownie Box" price={600} />
    </div>
  );
}
