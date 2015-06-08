class AnnouncementsController < ApplicationController
  #TODO
  before_filter :authenticate_user!, only: [:new, :create, :update]
  respond_to :json

  def index
    @announcements = Announcements.all
    render status: 200,
          json: {
            students: @announcements
          }
  end

  def create
    @announcement = Announcement.new(annoucement_params)
    if @announcement.save
      render status: 200,
              json: {
                student: @announcement,
                success: "New Announcement is created successfully"
              }
    else
      render status: 400,
              json: {
                error: @announcement.errors
              }
    end
  end

  private

  def annoucement_params
    params.permit(:content)
  end
end
