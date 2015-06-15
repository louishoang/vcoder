class Student < User
  belongs_to :cohort

  accepts_nested_attributes_for :cohort
end
