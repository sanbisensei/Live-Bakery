"use client";

export default function AddToOrderButton({ cake }: { cake: any }) {
  function handleAdd() {
    // Cart logic will be wired in checkout sprint
    alert(`${cake.name} added to your order!`);
  }

  return (
    <button
      onClick={handleAdd}
      className="font-body text-sm font-semibold bg-orange text-cocoa rounded-pill py-3 px-6 w-full md:w-fit"
    >
      Add to order
    </button>
  );
}
