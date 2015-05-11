class HomeController < ApplicationController
  include ApplicationHelper

  before_filter :unset_footer
  def index
  end
end
