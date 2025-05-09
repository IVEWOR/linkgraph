"use client";

export default function DeleteButton({ userId }) {
  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    await fetch(`/api/admin/delete-user/${userId}`, {
      method: "DELETE",
    });

    window.location.reload(); // or router.refresh() if using useRouter
  };

  return (
    <button onClick={handleDelete} className="text-red-600 hover:underline">
      Delete
    </button>
  );
}
