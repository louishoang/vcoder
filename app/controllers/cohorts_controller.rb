class CohortsController < ApplicationController
  before_filter :authenticate_user!
  respond_to :json

  def index
    @cohorts = Cohort.all
    render status: 200,
          json: {
            cohorts: @cohorts
          }
  end

  def show
  end

  def create

  end
end
