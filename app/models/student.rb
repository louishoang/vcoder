class Student < User
  belongs_to :cohort, foreign_key: :cohort_id

  def as_json(options = {})
    super(options.merge(include: :cohort))
  end
end
