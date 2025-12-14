from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user__username', 'status', 'created_at')
    search_fields = ('title', 'user__username')
    list_filter = ('status',)