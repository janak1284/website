import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, DateTime, Enum, Float, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import declarative_base, relationship
import enum

Base = declarative_base()

class UserRole(str, enum.Enum):
    participant = "participant"
    admin = "admin"

class JudgingRole(str, enum.Enum):
    judge = "judge"
    admin = "admin"

class TrackType(str, enum.Enum):
    software = "software"
    hardware = "hardware"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True) # Changed to nullable since we may want to enforce onboarding
    avatar_url = Column(String, nullable=True)
    role = Column(Enum(UserRole), default=UserRole.participant)
    
    participant_type = Column(String, nullable=True)
    
    # Foreign key to the team they join
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"), nullable=True)
    
    # Relationships
    team = relationship("Team", foreign_keys="User.team_id", back_populates="members")
    led_team = relationship("Team", uselist=False, foreign_keys="Team.leader_id", back_populates="leader")

class ProblemStatement(Base):
    __tablename__ = "problem_statements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    track = Column(Enum(TrackType), nullable=False)
    max_quota = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=False)  # Keep False until the 12:30 PM reveal
    
    teams = relationship("Team", back_populates="problem_statement")

class Team(Base):
    __tablename__ = "teams"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, index=True, nullable=False)
    join_code = Column(String(6), unique=True, index=True, nullable=False)
    
    # The leader is a user. Enforce unique so a user can only lead one team.
    leader_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    
    ps_id = Column(UUID(as_uuid=True), ForeignKey("problem_statements.id"), nullable=True)
    selected_track = Column(Enum(TrackType), nullable=True)
    current_round = Column(Integer, default=1)
    
    # Relationships
    leader = relationship("User", foreign_keys="Team.leader_id", back_populates="led_team")
    members = relationship("User", foreign_keys="User.team_id", back_populates="team")
    problem_statement = relationship("ProblemStatement", back_populates="teams")
    final_submission = relationship("FinalSubmission", uselist=False, back_populates="team")
    scores = relationship("Score", back_populates="team")

class ShortlistedTeam(Base):
    __tablename__ = "shortlisted_team"

    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String, nullable=False)
    join_code = Column(String(6), nullable=False)
    leader_id = Column(UUID(as_uuid=True), nullable=False)
    ps_id = Column(UUID(as_uuid=True), nullable=True)
    selected_track = Column(Enum(TrackType), nullable=True)
    current_round = Column(Integer, default=1)

class FinalSubmission(Base):
    __tablename__ = "final_submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"), unique=True, nullable=False)
    github_url = Column(String, nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    team = relationship("Team", back_populates="final_submission")

class JudgingStaff(Base):
    __tablename__ = "judging_staff"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(JudgingRole), default=JudgingRole.judge)

    scores = relationship("Score", foreign_keys="Score.judge_id", back_populates="judge")

class Score(Base):
    __tablename__ = "scores"
    __table_args__ = (UniqueConstraint('team_id', 'round_number', name='uix_team_round'),)

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"), nullable=False)
    judge_id = Column(UUID(as_uuid=True), ForeignKey("judging_staff.id"), nullable=False)
    judge_display_name = Column(String, nullable=True)
    track = Column(String, nullable=False)
    round_number = Column(Integer, nullable=False)
    overwritten_by_admin_id = Column(UUID(as_uuid=True), ForeignKey("judging_staff.id"), nullable=True)
    total_score = Column(Float, nullable=False)
    breakdown = Column(JSONB, nullable=True)

    team = relationship("Team", back_populates="scores")
    judge = relationship("JudgingStaff", foreign_keys=[judge_id], back_populates="scores")
    admin_overwriter = relationship("JudgingStaff", foreign_keys=[overwritten_by_admin_id])