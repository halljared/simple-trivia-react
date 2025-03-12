import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your trivia builder dashboard. Create and manage your
          trivia games from here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              No quizzes created yet.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Games</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">No active games.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Create a new quiz or host a game.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
