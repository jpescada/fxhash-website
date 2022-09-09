import React, { memo } from 'react';
import style from "./LiveMintingEvent.module.scss";
import { gql, useQuery } from "@apollo/client";
import { Frag_GenAuthor, Frag_GenPricing } from "../../queries/fragments/generative-token";
import { CardsLoading } from "../../components/Card/CardsLoading";
import { GenerativeToken } from "../../types/entities/GenerativeToken";
import { LiveMintingGenerativeTokenCard } from "../../components/Card/LiveMintingGenerativeTokenCard";

// replace with event tokens
const Qu_genTokens = gql`
  ${Frag_GenAuthor}
  ${Frag_GenPricing}
  query GenerativeTokens ($skip: Int, $take: Int, $sort: GenerativeSortInput, $filters: GenerativeTokenFilter) {
    generativeTokens(
      skip: $skip, take: $take, sort: $sort, filters: $filters
    ) {
      id
      name
      slug
      thumbnailUri
      flag
      labels
      ...Pricing
      supply
      originalSupply
      balance
      enabled
      royalties
      createdAt
      reserves {
        amount
      }
      ...Author
    }
  }
`
interface LiveMintingEventProps {
  eventId: string
}

const _LiveMintingEvent = ({ eventId }: LiveMintingEventProps) => {
  const { data, loading } = useQuery(Qu_genTokens, {
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: 0,
      take: 10,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-and-network",
  })
  const generativeTokens: GenerativeToken[] = data?.generativeTokens

  return (
    <div className={style.container}>
      <p>
        These are the projects created especially for this event.<br/>
        Make sure you have enough tezos in your wallet before minting.
      </p>
      <div className={style.container_token}>
        {generativeTokens?.length > 0 && generativeTokens.map(token => (
          <LiveMintingGenerativeTokenCard
            eventId={eventId}
            key={token.id}
            token={token}
            displayPrice
            displayDetails
            className={style.token}
          />
        ))}
        {loading && (
          <CardsLoading number={10} />
        )}
      </div>
    </div>
  );
};

export const LiveMintingEvent = memo(_LiveMintingEvent);