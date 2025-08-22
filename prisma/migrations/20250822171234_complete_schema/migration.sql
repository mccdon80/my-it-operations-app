BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[training_plans] (
    [id] NVARCHAR(1000) NOT NULL,
    [training_name] NVARCHAR(1000) NOT NULL,
    [training_type] NVARCHAR(1000) NOT NULL,
    [schedule_date] DATETIME2,
    [cost] DECIMAL(10,2),
    [max_attendees] INT,
    [remarks] NVARCHAR(1000),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [training_plans_status_df] DEFAULT 'Planned',
    [created_by] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [training_plans_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [training_plans_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[team_attendance] (
    [id] NVARCHAR(1000) NOT NULL,
    [user_id] NVARCHAR(1000) NOT NULL,
    [attendance_date] DATE NOT NULL,
    [check_in_time] DATETIME2,
    [check_out_time] DATETIME2,
    [status] NVARCHAR(1000),
    [remarks] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [team_attendance_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [team_attendance_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
