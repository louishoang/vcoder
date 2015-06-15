class Cohort < ActiveRecord::Base
  has_many :students
  validates :name, uniqueness: true

  STATUS_ENROLLING = "Enrolling"
end
