class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  ROLE_ADMIN = "Admin"
  ROLE_STUDENT = "Student"

  self.inheritance_column = :role

  devise :database_authenticatable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable
  has_many :authorizations, :dependent => :destroy

end
