module ApplicationHelper
  def comment_helper
    comment_placeholder = []
    comment_placeholder << "DOG"
    comment_placeholder << "Tell us more about your background"
    comment_placeholder << "Goal"
    comment_placeholder.join("</br>").html_safe
  end
end

