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

  def create
    @student = User.new(user_params)
    if @student.save
      render status: 200,
              json: {
                student: @student,
                message: "New student account is created successfully"
              }
    else
      render status: 400,
              json: {
                message: @student.errors
              }
    end
  end

  private

  def user_params
    params.require(:student).permit(:name, :password, :email)
  end
end
