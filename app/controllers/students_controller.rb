class StudentsController < ApplicationController
  before_filter :authenticate_user!, only: [:new, :create]
  respond_to :json

  def index
    #TODO: filter students only
    @students = User.all
    render status: 200,
          json: {
            students: @students
          }
  end
end
