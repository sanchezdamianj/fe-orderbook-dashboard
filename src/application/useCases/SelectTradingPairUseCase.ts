import type { TradingPair } from "@/domain/valueObjects/TradingPair";

export interface SelectTradingPairRequest {
  tradingPair: TradingPair;
}

export interface SelectTradingPairResponse {
  selectedPair: TradingPair;
}

export class SelectTradingPairUseCase {
  execute(request: SelectTradingPairRequest): SelectTradingPairResponse {
    return {
      selectedPair: request.tradingPair,
    };
  }
}
