import BoardDetail from "@/components/boards/BoardDetail";

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return <BoardDetail id={id} />;
}
