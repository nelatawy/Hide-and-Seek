import { PlayerRole } from './playerRole';

export interface SimulationSettings {
    n: number;
    role: PlayerRole;
    numberOfSims: number;
    proximity: boolean;
    dimensions: number;

}
