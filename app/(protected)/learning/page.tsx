import { ProtectedShell } from '@/components/ProtectedShell'
import { Card } from '@/components/Card'
import { requireUser } from '@/lib/guards'
import { prisma } from '@/lib/db'

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v')
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
    } else if (urlObj.hostname.includes('youtu.be')) {
      const videoId = urlObj.pathname.slice(1)
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
    }
  } catch {
    return null
  }
  return null
}

export default async function LearningPage() {
  await requireUser()

  const videos = await prisma.video.findMany({
    orderBy: {
      created_at: 'desc',
    },
  })

  return (
    <ProtectedShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Resources</h1>
          <p className="text-gray-600 mt-2">Videos and materials to help you settle in Finland</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {videos.map((video) => {
            const embedUrl = getYouTubeEmbedUrl(video.url)
            const tags = video.tags ? video.tags.split(',').filter(Boolean) : []

            return (
              <Card key={video.id}>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{video.title}</h2>

                {embedUrl && (
                  <div className="aspect-video mb-3">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full rounded"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                {!embedUrl && (
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mb-3 text-blue-600 hover:text-blue-700 break-all"
                  >
                    {video.url}
                  </a>
                )}

                {video.description && (
                  <p className="text-gray-600 text-sm mb-3">{video.description}</p>
                )}

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            )
          })}

          {videos.length === 0 && (
            <Card className="col-span-2">
              <p className="text-gray-600 text-center">No videos available yet</p>
            </Card>
          )}
        </div>
      </div>
    </ProtectedShell>
  )
}
