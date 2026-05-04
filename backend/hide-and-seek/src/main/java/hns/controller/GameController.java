package hns.controller;

import hns.model.GameSession;
import hns.model.PlayerRole;
import hns.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/setup")
    public ResponseEntity<GameSession> setup(@RequestBody Map<String, Object> body) {
        throw new UnsupportedOperationException("TODO");
    }

    @GetMapping("/state")
    public ResponseEntity<GameSession> getState() {
        throw new UnsupportedOperationException("TODO");
    }

    @PostMapping("/play")
    public ResponseEntity<Map<String, Object>> play(@RequestBody Map<String, Object> body) {
        throw new UnsupportedOperationException("TODO");
    }

    @PostMapping("/simulate")
    public ResponseEntity<Map<String, Object>> simulate() {
        throw new UnsupportedOperationException("TODO");
    }

    @PostMapping("/reset")
    public ResponseEntity<Void> reset() {
        throw new UnsupportedOperationException("TODO");
    }
}
