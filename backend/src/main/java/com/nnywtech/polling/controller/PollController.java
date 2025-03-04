package com.nnywtech.polling.controller;

import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import com.nnywtech.polling.model.Poll;
import com.nnywtech.polling.service.PollService;

import java.util.List;

@RestController
@RequestMapping("/api/polls")
public class PollController {
    @Autowired
    private PollService pollService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping
    public ResponseEntity<Poll> createPoll(@RequestBody Poll poll) {
        Poll savedPoll = pollService.createPoll(poll);
        messagingTemplate.convertAndSend("/topic/polls", savedPoll);
        return ResponseEntity.ok(savedPoll);
    }

    @PostMapping("/{pollId}/vote/{optionId}")
    @RateLimiter(name = "voteRateLimiter", fallbackMethod = "voteRateLimitExceeded")
    public ResponseEntity<Poll> vote(@PathVariable Long pollId, @PathVariable Long optionId) {
        Poll updatedPoll = pollService.vote(pollId, optionId);
        messagingTemplate.convertAndSend("/topic/polls", updatedPoll);
        return ResponseEntity.ok(updatedPoll);
    }

    @GetMapping
    public ResponseEntity<List<Poll>> getAllPolls() {
        return ResponseEntity.ok(pollService.getAllPolls());
    }

    public ResponseEntity<String> voteRateLimitExceeded(Long pollId, Long optionId, Throwable t) {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body("Too many votes. Try again later.");
    }
}