class Prospect < ActiveRecord::Base
  GENDER_MALE = "Male"
  GENDER_FEMALE = "Female"
  PAYMENT_TYPE_UP_FRONT = "Up Front"
  PAYMENT_TYPE_MONTHLY = "Monthly"

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :first_name, length: { maximum: 50 }
  validates :last_name, length: { maximum: 50 }
  validates :email, presence: true
  validates :email, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, on: :create }
  validates :comment, length: { maximum: 1000 }
  validates :gender, inclusion: { in: %w(Male Female) }

  def self.gender_choices
    [[GENDER_MALE, GENDER_MALE],
    [GENDER_FEMALE, GENDER_FEMALE]]
  end

  def self.payment_types
    [[PAYMENT_TYPE_UP_FRONT, PAYMENT_TYPE_UP_FRONT],
    [PAYMENT_TYPE_MONTHLY, PAYMENT_TYPE_MONTHLY]]
  end
end
