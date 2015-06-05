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
    @student = Student.new(user_params)
    if @student.save
      render status: 200,
              json: {
                student: @student,
                success: "New student account is created successfully"
              }
    else
      render status: 400,
              json: {
                error: @student.errors
              }
    end
  end

  def update
    @student = Student.find(params[:id])
    if @student.update(user_params)
      render status: 200,
        json: {
          student: @student,
          success: "Update succesffully"
        }
     else
      render status: 400,
        json: {
          error: @student.errors
        }
    end
  end

  private

  def user_params
    params.permit(:name, :password, :email, :is_active, :role)
  end
end
