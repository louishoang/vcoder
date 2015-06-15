class Cohort < ActiveRecord::Base
  has_many :students

  STATUS_ENROLLING = "Enrolling"
end
