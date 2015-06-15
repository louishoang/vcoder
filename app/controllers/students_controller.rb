class StudentsController < ApplicationController
  before_filter :authenticate_user!, only: [:new, :create]
  respond_to :json

  def index
    @students = User.all
    render status: 200,
          json: {
            students: @students
          }
  end

  def create
    @student = Student.new(user_params)
    if params[:cohort].is_a?(Hash)
      @cohort = Cohort.new(cohort_params)
      @cohort.save; @cohort.reload
      @student.cohort = @cohort
    end
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

  def all_params
    params.permit(:name, :password, :email, :is_active, :cohort_id, :cohort => [:name, :start_at, :end_at])
  end

  def user_params
    { name: all_params[:name],
      password: all_params[:password],
      email: all_params[:email],
      is_active: all_params[:is_active],
      cohort_id: all_params[:cohort_id]
    }
  end

  def cohort_params
    cohort = all_params[:cohort]
    { name: cohort[:name],
      start_at: cohort[:start_at],
      end_at: cohort[:end_at]
    }
  end
end
