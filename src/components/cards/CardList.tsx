"use client";

import { useQuery } from "@tanstack/react-query";
import { getCardsApi } from "@/services/cards";
import { CardTitle } from "@/types/card";
import CardItem from "./CardItem";
import CardCreateForm from "./CardCreateForm";

interface CardListProps {
    boardId: string;
}

const ORDER: CardTitle[] = [
    CardTitle.Icebox,
    CardTitle.Backlog,
    CardTitle.OnGoing,
    CardTitle.WaitingForReview,
    CardTitle.Done,
];

export default function CardList({ boardId }: CardListProps) {
    const cardsQuery = useQuery({
        queryKey: ["cards", boardId],
        queryFn: () => getCardsApi(boardId),
    });

    if (cardsQuery.isLoading) {
        return <div className="text-gray-400 p-4">Loading cards...</div>;
    }

    if (!cardsQuery.data?.ok) {
        return (
            <div className="text-red-400 p-4">
                {cardsQuery.data?.message || "Error loading cards"}
            </div>
        );
    }

    const cards = cardsQuery.data.data || [];

    const sortedCards = [...cards].sort(
        (a, b) => ORDER.indexOf(a.title) - ORDER.indexOf(b.title)
    );

    const existingTitles = cards.map((c: any) => c.title as CardTitle);
    const allPossibleTitles = Object.values(CardTitle);
    const availableTitles = allPossibleTitles.filter(
        (t) => !existingTitles.includes(t)
    );

    return (
        <div className=" bg-white">
            <div className="hidden md:flex flex-wrap gap-4 p-4 h-full">
                {sortedCards.map((card: any) => (
                    <CardItem boardId={boardId} key={card.id} card={card} />
                ))}
                <CardCreateForm boardId={boardId} availableTitles={availableTitles} />
            </div>

            <div className="md:hidden flex flex-col items-center gap-4 p-4">
                {sortedCards.map((card: any) => (
                    <CardItem boardId={boardId} key={card.id} card={card} />
                ))}
                <CardCreateForm
                    boardId={boardId}
                    availableTitles={availableTitles}
                />
            </div>
        </div>
    );
}
