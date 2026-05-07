package hns.controller;

import hns.model.GameResult;
import hns.model.GameSettings;
import hns.model.PlayerRole;
import hns.model.SimulationResults;
import hns.model.SimulationSettings;
import hns.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    // Body: { "spotIndex": 2 }  (0-based index into the spots list)
    @PostMapping("/play")
    public ResponseEntity<GameResult> play(@RequestBody GameSettings settings) {
        return ResponseEntity.ok(gameService.play(settings));
    }

    @PostMapping("/simulate")
    public ResponseEntity<SimulationResults> simulate(@RequestBody SimulationSettings settings) {
        return ResponseEntity.ok(gameService.simulate(settings));
    }

}
