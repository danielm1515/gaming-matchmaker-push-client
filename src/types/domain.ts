export type SkillLevel = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'MASTER';
export type AvailabilityStatus = 'ONLINE' | 'LOOKING_FOR_PARTY' | 'IN_GAME' | 'AWAY' | 'OFFLINE';
export type PartyStatus = 'OPEN' | 'FULL' | 'IN_GAME' | 'DISBANDED';
export type MessageType = 'TEXT' | 'SYSTEM' | 'JOIN' | 'LEAVE';

export interface Game {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  max_party_size: number;
  is_active: boolean;
}

export interface Region {
  id: string;
  name: string;
  code: string;
  countries: string[];
}

export interface PlayerGame {
  game: Game;
  skill_level: SkillLevel;
  hours_played: number;
}

export interface Player {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  region: Region | null;
  country_code: string | null;
  skill_level: SkillLevel;
  availability: AvailabilityStatus;
  games_played: number;
  player_games: PlayerGame[];
  last_seen_at: string | null;
  created_at: string;
}

export interface PartyMember {
  player: Player;
  joined_at: string;
  is_ready: boolean;
}

export interface Party {
  id: string;
  game: Game;
  region: Region;
  leader: Player;
  members: PartyMember[];
  name: string | null;
  max_size: number;
  min_skill: SkillLevel;
  max_skill: SkillLevel;
  status: PartyStatus;
  is_public: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  party_id: string;
  sender: { id: string; username: string; avatar_url: string | null } | null;
  content: string;
  type: MessageType;
  sent_at: string;
}

export interface DiscordChannel {
  party_id: string;
  text_channel_id: string;
  voice_channel_id: string | null;
  invite_url: string;
  password: string | null;
  created_at: string;
}

export interface MatchResult {
  party: Party;
  match_score: number;
  region_score: number;
  skill_score: number;
  fill_score: number;
  availability_score: number;
}

// API request shapes
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  country_code?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface PlayerUpdateRequest {
  username?: string;
  bio?: string;
  country_code?: string;
  skill_level?: SkillLevel;
  availability?: AvailabilityStatus;
  avatar_url?: string;
  region_id?: string;
}

export interface AddGameRequest {
  game_id: string;
  skill_level?: SkillLevel;
  hours_played?: number;
}

export interface CreatePartyRequest {
  game_id: string;
  region_id: string;
  name?: string;
  max_size?: number;
  min_skill?: SkillLevel;
  max_skill?: SkillLevel;
  is_public?: boolean;
}

export interface PlayerListParams {
  game_id?: string;
  region_code?: string;
  country_code?: string;
  skill_level?: SkillLevel;
  availability?: AvailabilityStatus;
  limit?: number;
  offset?: number;
}

export interface PartyListParams {
  game_id?: string;
  region_code?: string;
  skill_level?: SkillLevel;
  limit?: number;
  offset?: number;
}
