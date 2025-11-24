// CardGrid.tsx
import React, { memo, useRef, useState } from "react";
import { Card } from "./Card";
import { AgentDetail } from "./AgentDetail";
import type { CardInterface } from "../../types";
import RealEstateAgentVoice from "./RealEstateAgentVoice";
import "./CardGrid.css";

interface CardGridProps {
  cards: CardInterface[];
  className?: string;
  handleStart: (agent_code: string) => void;
  handleEnd: () => void;
  showRealEstateAgentVoice?: boolean;
  sessionStatus?: string | undefined | null;
}

export const CardGrid: React.FC<CardGridProps> = memo(
  ({
    cards,
    className = "",
    handleStart,
    handleEnd,
    showRealEstateAgentVoice,
    sessionStatus,
  }) => {
    const [selectedAgent, setSelectedAgent] = useState<CardInterface | null>(
      null
    );
    const [agentName, setAgentName] = useState<string | null>(null);
    const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const openAgentDetail = (agent: CardInterface) => {
      setSelectedAgent(agent);
      setAgentName(agent.title);
      // Scroll to the card first so it's visible
      const cardElement = cardRefs.current[agent.id];
      cardElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const closeAgentDetail = () => {
      setSelectedAgent(null);
      setAgentName(null);
    };

    // Get the DOM element of the currently active/selected card
    const getSelectedCardElement = (): HTMLElement | null => {
      if (!selectedAgent) return null;
      return cardRefs.current[selectedAgent.id] || null;
    };

    if (selectedAgent) {
      return (
        <div className="agent-detail-wrapper">
          <AgentDetail
            agent={selectedAgent}
            onBack={closeAgentDetail}
            handleStart={handleStart}
            handleEnd={handleEnd}
            getAgentName={setAgentName}
          />
          {showRealEstateAgentVoice && (
            <RealEstateAgentVoice
              onClose={handleEnd}
              sessionStatus={sessionStatus}
              agentName={agentName ?? undefined}
              anchorElement={getSelectedCardElement()} // ← pass the card DOM node
            />
          )}
        </div>
      );
    }

    return (
      <div className={`card-grid-wrapper relative ${className}`}>
        {/* Show voice bar even in grid mode if a session is active */}
        {showRealEstateAgentVoice && !selectedAgent && (
          <RealEstateAgentVoice
            onClose={handleEnd}
            sessionStatus={sessionStatus}
            agentName={agentName ?? undefined}
            // You can optionally anchor it to the card that started the session
            anchorElement={
              agentName
                ? cardRefs.current[
                    cards.find((c) => c.title === agentName)?.id || ""
                  ] || null
                : null
            }
          />
        )}

        <div className="card-grid">
          {cards.map((card) => (
            <div
              key={card.id}
              ref={(el) => (cardRefs.current[card.id] = el)} // ← assign ref
              className="card-grid-item"
              role="button"
              tabIndex={0}
              onClick={() => openAgentDetail(card)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openAgentDetail(card);
                }
              }}
            >
              <Card
                card={card}
                isActive={false}
                handleStart={handleStart}
                handleEnd={handleEnd}
                getAgentName={setAgentName}
                onAgentSelect={() => {}}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
);

CardGrid.displayName = "CardGrid";
