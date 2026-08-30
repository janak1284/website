import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship
import enum

Base = declarative_base()

class UserRole(str, enum.Enum):
    participant = "participant"
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
    assigned_software = Column(String, nullable=True)
    
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

class FinalSubmission(Base):
    __tablename__ = "final_submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"), unique=True, nullable=False)
    github_url = Column(String, nullable=False)
    demo_link = Column(String, nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    team = relationship("Team", back_populates="final_submission")