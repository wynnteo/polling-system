package com.nnywtech.polling.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nnywtech.polling.model.Poll;

public interface PollRepository extends JpaRepository<Poll, Long> {
}
