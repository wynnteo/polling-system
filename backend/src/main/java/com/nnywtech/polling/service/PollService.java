package com.nnywtech.polling.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nnywtech.polling.exception.ResourceNotFoundException;
import com.nnywtech.polling.model.Option;
import com.nnywtech.polling.model.Poll;
import com.nnywtech.polling.repository.PollRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PollService {
    @Autowired
    private PollRepository pollRepository;

    public Poll createPoll(Poll poll) {
        poll.setCreatedAt(LocalDateTime.now());
        poll.getOptions().forEach(option -> option.setPoll(poll));
        return pollRepository.save(poll);
    }

    public Poll vote(Long pollId, Long optionId) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found"));
        Option option = poll.getOptions().stream()
                .filter(o -> o.getId().equals(optionId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Option not found"));
        option.setVotes(option.getVotes() + 1);
        return pollRepository.save(poll);
    }

    public List<Poll> getAllPolls() {
        return pollRepository.findAll();
    }
}